import { Injectable } from '@nestjs/common';
import Jimp from 'jimp';

@Injectable()
export class CompressService {

    async compress(imageData: Buffer, quality: number = 10, type: string = 'jpeg') {
        try {
            const image = await Jimp.read(imageData)
            image.quality(quality);
            const compressedImage = await image.getBufferAsync(type == 'jpeg' ? Jimp.MIME_JPEG : Jimp.MIME_PNG);
            return compressedImage;
        } catch (error) {
            console.log(error)
        }
    }

}
