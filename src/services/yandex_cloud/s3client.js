import { S3Client } from "@aws-sdk/client-s3";
import { yandexStore } from "../../store/yandex.js";
// Установка региона Object Storage
const REGION = "ru-central1";
// Установка эндпоинта Object Storage
const ENDPOINT = "https://storage.yandexcloud.net";
// Создание клиента для Object Storage

let s3Client = null;
function getS3Client(){
    if (!s3Client){
        s3Client = new S3Client({ 
            region: REGION, 
            endpoint: ENDPOINT, 
            credentials:{
                accessKeyId: yandexStore.SECRET_API_KEY_ID,
                secretAccessKey: yandexStore.SECRET_API_KEY,
            }
        });
    }
    return s3Client;
}
export default getS3Client;