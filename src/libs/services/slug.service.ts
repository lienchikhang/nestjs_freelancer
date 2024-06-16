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

    public revert(value: string): string {
        return value.replace(/&/g, ' & ')
            // Chia các từ bằng dấu -
            .split('-')
            // Chuyển đổi các từ thành dạng chữ hoa đầu từ
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            // Kết hợp các từ lại thành chuỗi
            .join(' ')
            // Loại bỏ khoảng trắng thừa
            .replace(/\s+/g, ' ')
            .trim();
    }
}

export default SlugService;