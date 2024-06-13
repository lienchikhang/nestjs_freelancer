import { Injectable } from "@nestjs/common";

@Injectable()
class SlugService {
    public convert(value: string): string {
        let lowerString = value.toLowerCase();

        // Thay thế các khoảng trắng bằng dấu gạch ngang
        let hyphenatedString = lowerString.replace(/\s+/g, '-');

        // Loại bỏ các dấu tiếng Việt
        let noAccentString = hyphenatedString.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return noAccentString;
    }
}

export default SlugService;