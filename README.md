# Пользовательские турбо-компоненты
Репозиторий с кодом пользовательских компонентов, которые могут быть использованы на Турбо-страницах.

## Разработка
```bash
git clone git@github.com:turboext/custom-components.git
cd custom-components
npm i
npm start

open https://localhost:8443/render/ext-fancy-button/default
```

Чтобы при локальной разработке браузер не ругался на неподтвержденный сертификат - можно воспользоваться https://github.com/FiloSottile/mkcert

## Структура папки с блоками
```
components/
└── ExtFancyButton
    ├── ExtFancyButton.examples
    │   └── default.xml
    ├── ExtFancyButton.scss
    └── ExtFancyButton.tsx
```

`ExtFancyButton` - папка с блоком

`ExtFancyButton.examples` - папка с примерами данных для отображения блока. Используется для отладки.

## Правила именования блоков/директорий.
Имена всех блоков должны начинаться с приставки `Ext`.

## Как писать примеры
Примеры с rss блока лежат в папке `.examples` внутри папки блока в файлах с расширением `xml`. Пример rss:
```
<p data-name='ext-fancy-button' data-data='{"some-data": "some value"}'>
    <div class="abc">
         Привет мир!!!
    </div>
    hi
    <button> </button>
</p>

```
где в параметре `data-name` указывается имя блока в кебаб-кейсе, а в `data-data` - его пропсы.

Пример будет доступен по ссылке `https://localhost:8443/render/ext-fancy-button/default`

где `ext-fancy-button` - имя блока в кебаб-кейсе, `default` - имя файла с примером без расширения.
