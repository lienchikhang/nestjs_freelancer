const alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'J',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];

class Otp {
    static generate(): string {

        let finalOtp = '';

        for (let i = 0; i < 6; i++) {
            if (i % 2 == 0) {
                finalOtp += alphabet[Math.floor(Math.random() * 25)];
            } else {
                finalOtp += Math.floor(Math.random() * 9);
            }
        }

        return finalOtp;
    }
}

export default Otp;