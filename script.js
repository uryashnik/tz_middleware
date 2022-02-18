const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/product.schema.json",
    "title": "Product",
    "description": "A product from Acme's catalog",
    "type": "object",
    "properties": {
        "productId": {
            "description": "The unique identifier for a product",
            "type": "integer"
        },
        "productName": {
            "description": "Name of the product",
            "type": "string"
        },
        "price": {
            "description": "The price of the product",
            "type": "number",
            "exclusiveMinimum": 0
        },
        "tags": {
            "description": "Tags for the product",
            "type": "array",
            "items": {
                "type": "string"
            },
            "minItems": 4,
            "uniqueItems": true
        },
        "dimensions": {
            "type": "object",
            "properties": {
                "length": {
                    "type": "number"
                },
                "width": {
                    "type": "number"
                },
                "height": {
                    "type": "number"
                }
            },
            "required": [
                "length",
                "width",
                "height"
            ]
        }
    },
    "required": [
        "productId",
        "productName",
        "price",
        "tags"
    ]
};

function parser(key, value) {
    switch (value.type) {
        case TYPE_OBJECT:
            return getObjectValue(value);
        case TYPE_ARRAY:
            return getArray(key, value);
        case TYPE_NUMBER:
        case TYPE_INTEGER:
            return getRandomInteger(value.exclusiveMinimum);
        case TYPE_STRING:
            return getRandomName(NAMES);
    }
}

function getObjectValue(data) {
    const result = {};
    if (data && data.properties && data.type === 'object') {
        const requiredFields = Array.isArray(data.required) ? data.required : [];
        // фильтруем обязательные поля у обьекта, остальные берем опционально, проверяем чтобы тип был в нашем перечне ALLOWED_TYPES
        const fields = Object.keys(data.properties).filter(propName => (requiredFields.some(field => propName === field) ? true : Math.random() > 0.5) && ALLOWED_TYPES.some(type => type === data.properties[propName].type));
        fields.forEach(key => result[key] = parser(key, data.properties[key]));
    }
    return result;
}

function getArray(parentFieldName, data) {
    switch (data.items.type) {
        case TYPE_STRING:
            return createArray(TYPE_STRING, data.minItems, data.uniqueItems, parentFieldName);
        case TYPE_NUMBER:
        case TYPE_INTEGER:
            return createArray(TYPE_NUMBER, data.minItems, data.uniqueItems, parentFieldName);
        default:
            return [];
    }

}

function createArray(type, minLength = 1, unique = false, name) {
    const result = [];
    const maxLength = unique ? NAMES.length : 100;
    if (minLength < 1) {
        minLength = 1;
    }
    if (minLength > maxLength) {
        console.warn(`минимальная длинна уникальных значений поля ${name} превышает исходные данные`);
        minLength = maxLength;
    }
    const length = getRandomInteger(minLength, maxLength);
    let temporaryArray = [...NAMES];

    for (let i = 0; i < length; i++) {
        if (unique && type === TYPE_STRING) {
            const name = getRandomName(temporaryArray);
            result.push(name);
            temporaryArray = temporaryArray.filter(item => item !== name);
        } else {
            result.push(type === TYPE_STRING ?
                getRandomName(NAMES)
                :
                getRandomInteger(1, 100)
            )
        }

    }
    return result;
}

console.log(getObjectValue(schema));

