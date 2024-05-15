const d = {
    "perma_codes": [
        {
            "ID": 6,
            "CreatedAt": "2024-04-18T08:25:05.109925Z",
            "UpdatedAt": "2024-04-18T08:25:05.109925Z",
            "DeletedAt": null,
            "user_address": "0x53856c7e3d31416366d30d65e80640590fd789c6",
            "referral_code": "OBZ794"
        },
        {
            "ID": 2,
            "CreatedAt": "2024-04-15T17:14:12.599614Z",
            "UpdatedAt": "2024-04-15T17:14:12.599614Z",
            "DeletedAt": null,
            "user_address": "0x0ddd32c3a30742ddc6db2e668c6ab133a064b8b1",
            "referral_code": "QKW821"
        },
        {
            "ID": 4,
            "CreatedAt": "2024-04-18T08:22:07.686584Z",
            "UpdatedAt": "2024-04-18T08:22:07.686584Z",
            "DeletedAt": null,
            "user_address": "0x9ced08aee17fbc333bb7741ec5eb2907b0ca4241",
            "referral_code": "catalog"
        },
        {
            "ID": 3,
            "CreatedAt": "2024-04-18T08:22:07.686584Z",
            "UpdatedAt": "2024-04-18T08:22:07.686584Z",
            "DeletedAt": null,
            "user_address": "0x54daa1c474789199cce931c6523ab8bd34535d04",
            "referral_code": "manikanta"
        },
        {
            "ID": 1,
            "CreatedAt": "2024-04-15T17:14:12.599614Z",
            "UpdatedAt": "2024-04-15T17:14:12.599614Z",
            "DeletedAt": null,
            "user_address": "0x3139c33b7218237bbd22235c78078731216fd05b",
            "referral_code": "MANI08"
        }
    ],
    "referrals": [
        {
            "ID": 125,
            "CreatedAt": "2024-05-13T11:57:15.784551Z",
            "UpdatedAt": "2024-05-13T11:57:15.784551Z",
            "DeletedAt": null,
            "referral_code": "manikanta",
            "referrer_address": "0x54daa1c474789199cce931c6523ab8bd34535d04",
            "user_address": "0x5ec6995966f9533065039c0d912b9e86525eeb40"
        },
        {
            "ID": 126,
            "CreatedAt": "2024-05-13T11:59:38.864265Z",
            "UpdatedAt": "2024-05-13T11:59:38.864265Z",
            "DeletedAt": null,
            "referral_code": "manikanta",
            "referrer_address": "0x54daa1c474789199cce931c6523ab8bd34535d04",
            "user_address": "0x1dd950a2051c217357c3441dcfb6d08db6aef54c"
        },
        {
            "ID": 127,
            "CreatedAt": "2024-05-13T12:00:08.861228Z",
            "UpdatedAt": "2024-05-13T12:00:08.861228Z",
            "DeletedAt": null,
            "referral_code": "manikanta",
            "referrer_address": "0x54daa1c474789199cce931c6523ab8bd34535d04",
            "user_address": "0x8d2c2027fffe2d2adaf79a0ff3f6083b53826016"
        }
    ]
}

data = {}
d.perma_codes.forEach(item => {
    if (!data[item.user_address]) {
        data[item.user_address] = {
            referral_code: item.referral_code,
            referred_to: []
        };
    }
});


d.referrals.forEach(item => {
    if (data[item.referrer_address]) {
        data[item.referrer_address].referred_to.push(item.user_address);
    }
});

console.log(data);

console.log(data)


