import { Injectable } from '@nestjs/common';
import Jimp from 'jimp';

@Injectable()
export class CompressService {

    async compress(imageData: Buffer, quality: number = 10) {
        const image = await Jimp.read(imageData)
        image.quality(quality);
        const compressedImage = await image.getBufferAsync(Jimp.MIME_JPEG);
        return compressedImage;
    }

}
