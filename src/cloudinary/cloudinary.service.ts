import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {

    constructor() {
        cloudinary.config({
            cloud_name: "drfjok8d7",
            api_key: "319771257136443",
            api_secret: "aGlS8yvKAnYu1JBtT_hzLvFCunQ"
            // Click 'View Credentials' below to copy your API secret
        });
    }

    upload(imageData: Buffer): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'db_freelancer', upload_preset: 'h5hkitnx' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(imageData);
        });
    }
}
