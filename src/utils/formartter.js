class Formartter {
    replacer (string, toreplace) {
        if (string === null || string === '' || string === undefined || string === NaN) {
            return toreplace
        } else {
            return string
        }
    }
    
    capitalizeEachWord (string) {
        const words = string.split(" " || '-')
    
        for (let i = 0; i < words.length; i++) {
            try {
                words[i] = words[i][0].toUpperCase() + (words[i].substr(1)).toLowerCase();
            } catch (err) {
                return string
            }   
        }
        return words.join(" ")
    }
}

export default new Formartter