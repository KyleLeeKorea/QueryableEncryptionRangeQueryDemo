const { MongoClient, Binary } = require("mongodb");
const { getCredentials } = require("./your_credentials");
credentials = getCredentials();

// start-key-vault
const eDB = "encryption";
const eKV = "__keyVault";
const keyVaultNamespace = `${eDB}.${eKV}`;
// end-key-vault

// start-kmsproviders
const kmsProviders = {
  aws: {
    accessKeyId: credentials["AWS_ACCESS_KEY_ID"],
    secretAccessKey: credentials["AWS_SECRET_ACCESS_KEY"],
  },
};
// end-kmsproviders

async function run() {
  // start-schema
  const uri = credentials.MONGODB_URI;
  const unencryptedClient = new MongoClient(uri);
  await unencryptedClient.connect();
  const keyVaultClient = unencryptedClient.db(eDB).collection(eKV);
  const dek1 = await keyVaultClient.findOne({ keyAltNames: "dataKey1" });
  const dek2 = await keyVaultClient.findOne({ keyAltNames: "dataKey2" });
  const dek3 = await keyVaultClient.findOne({ keyAltNames: "dataKey3" });
  const dek4 = await keyVaultClient.findOne({ keyAltNames: "dataKey4" });
  const dek5 = await keyVaultClient.findOne({ keyAltNames: "dataKey5" });
  const secretDB = "medicalRecords";
  const secretCollection = "patients";
  const encryptedFieldsMap = {
    [`${secretDB}.${secretCollection}`]: {
      fields: [
        {
          keyId: dek1._id,
          path: "patientId",
          bsonType: "int",
          queries: { queryType: "equality" },
        },
        {
          keyId: dek2._id,
          path: "medications",
          bsonType: "array",
        },
        {
          keyId: dek3._id,
          path: "patientRecord.ssn",
          bsonType: "string",
          queries: { queryType: "equality" },
        },
        {
          keyId: dek4._id,
          path: "patientRecord.billing",
          bsonType: "object",
        },
        {
          keyId: dek5._id,
          path: "billAmount",
          bsonType: "int",
          queries: { queryType: "range" },
        },
      ],
    },
  };
  // end-schema

  // start-extra-options
  const extraOptions = {
    cryptSharedLibPath: credentials["SHARED_LIB_PATH"],
  };
  // end-extra-options

  // start-client
  const encryptedClient = new MongoClient(uri, {
    autoEncryption: {
      keyVaultNamespace: keyVaultNamespace,
      kmsProviders: kmsProviders,
      extraOptions: extraOptions,
      encryptedFieldsMap: encryptedFieldsMap,
    },
  });
  await encryptedClient.connect();
  // end-client

  try {
    const unencryptedColl = unencryptedClient
      .db(secretDB)
      .collection(secretCollection);

    // start-insert
    const encryptedColl = encryptedClient
      .db(secretDB)
      .collection(secretCollection);

    // 10개의 환자 데이터 배열 생성 (한글 변환됨)
    const patientData = [
      {
        firstName: "철수",
        lastName: "김",
        patientId: 12345678,
        address: "서울특별시 강남구 테헤란로 123",
        patientRecord: {
          ssn: "987-65-4320",
          billing: {
            type: "Visa",
            number: "4111111111111111",
          },
        },
        medications: ["아토르바스타틴", "레보티록신"],
        billAmount: 1000,
      },
      {
        firstName: "영희",
        lastName: "박",
        patientId: 23456789,
        address: "서울특별시 마포구 홍대입구 45",
        patientRecord: {
          ssn: "876-54-3210",
          billing: {
            type: "Mastercard",
            number: "5555555555554444",
          },
        },
        medications: ["리시노프릴", "메트포르민"],
        billAmount: 1200,
      },
      {
        firstName: "민수",
        lastName: "이",
        patientId: 34567890,
        address: "부산광역시 해운대구 해변로 78",
        patientRecord: {
          ssn: "765-43-2109",
          billing: {
            type: "Amex",
            number: "378282246310005",
          },
        },
        medications: ["암로디핀", "알부테롤"],
        billAmount: 800,
      }
    ];

    // insertMany로 환자 데이터 입력
    const result = await encryptedColl.insertMany(patientData);
    console.log(`${result.insertedCount}개의 문서가 성공적으로 삽입되었습니다.`);
    // end-insert

    // start-find
    console.log("일반 클라이언트로 문서 찾기");
    console.log(await unencryptedColl.findOne({ firstName: /철수/ }));
    console.log("암호화된 필드 검색으로 문서 찾기");
    console.log(
      await encryptedColl.findOne({ "patientRecord.ssn": "987-65-4320" })
    );
    // end-find
  } finally {
    await unencryptedClient.close();
    await encryptedClient.close();
  }
}

run().catch(console.dir);
