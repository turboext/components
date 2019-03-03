/** Для самой частой ошибки (ошибка в пути) делаем человеко-понятное сообщение */
const handleErr = (e: NodeJS.ErrnoException, examplePath: string): Error | NodeJS.ErrnoException => {
    if (e.code === 'ENOENT') {
        return new Error(`Не нашли стаба по адресу: ${examplePath}`);
    }

    return e;
};

export default handleErr;
