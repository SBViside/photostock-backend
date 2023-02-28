// JWT SETTINGS
export const secret_access = 'MYACCESS';
export const secret_refresh = 'MYREFRESH';
export const access_token_lifetime = '24h';

// MIN AND MAX LENGTH FOR VALIDATION
export const maxLengths = {
    username: {
        min: 4, max: 16
    },
    password: {
        min: 8, max: 16
    }
}

// AVATAR GENERATOR SETTINGS
export const avatar_size = 500;