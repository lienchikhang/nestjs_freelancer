import { Injectable } from "@nestjs/common";
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
class BcryptService {
    public encode(value: string): string {
        return hashSync(value, 7);
    }

    public decode(hash: string, value: string): boolean {
        return compareSync(value, hash);
    }
}

export default BcryptService;