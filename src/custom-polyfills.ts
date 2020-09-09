Array.prototype.getUnique = function () {
    return Array.from(new Set(this));
};

Array.prototype.removeItemByReference = function (element) {
    return this.filter(el => el !== element);
};

String.prototype.acronym = function (count = 2) {
    if (!this)
        return '';

    return this
        .split(/\s/)
        .slice(0, count)
        .map((word) => word && word.charAt(0))
        .join('');
};

Math.getRandomInteger = function (from, to) {
    from = Math.ceil(from);
    to = Math.floor(to);
    return Math.floor(Math.random() * (to - from + 1)) + from;
};



