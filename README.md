# Название
Сборщик фронта под битрикс

## Предустановки
- Node.js

## Используемые скрипты
Установить зависиомсти
`$ npm ci`

Запустить фронт в режиме разработки (http://localhost:8080)  
`$ npm run dev`
 
Собрать фронт  
`$ npm run build`

## Как пользоваться (упрощенная версия)
- Установить зависимости
- Реализовать верстку шаблона в пространствах /template и /components:
    - в /src/template:
        - в папке css/ глобальные стили (глобальные = супер часто используемые)
        - в папке js/ глобальные модули
        - в папке pug/layouts pug-шаблоны, наследуюемые другими страницами шаблоны
        - в папке pug/meta pug-шаблон meta-элементов (шапка, подвал)
    - в /src/components:
        - в файле template.pug pug-шаблон
        - в файле style.scss стили
        - в папке modules/ модули, используемые внутри компонета (если какой-то модуль копипастится из раза в раз, то наверн он должен быть в template/ и реализован немного иначе)
        - в файле component.js реализация модуля компонета
        - когда стилей, pug-шаблонов и вариаций component.js становится много, допустима следующая структура следующая:
            - в pug/ pug-шаблоны
            - в css/ стили
            - в js/ вариации модуля компонента
            - в папке modules/ модули, используемые внутри компонета
    - в /src/styles.js поключение стилей шаблона/компонентов
    - в /src/scripts.js инициализация модулей шаблона/компонентов
- Для ясности вот примерная структура /src в начале работы:
    - /assets
        - /fonts
        - /media
            - /temp
            - /...
    - /components
        - /componentName
            - /modules
                - /moduleName
                    - script.js
                - /moduleName1
                    - script.js
            - template.pug
            - style.scss
            - component.js
    - /template
        - /pug
            - /layouts
                - main.pug
                - secondary.pug
                - ...
            - /meta
                - header.pug
                - footer.pug
        - /css
            - fonts.scss
            - vars.scss
            - icons.scss
            - ...
        - /js
            - /moduleName
                - script.js
            - /moduleName1
                - script.js
            - ..
    - /styles.js
    - /scripts.js
- Для подключения модулей использовать алиасы:
    - @: ./src,
    - @template: ./src/template
    - @components: ./src/components
    - @utils: ./src/utils

## Как пользоваться
- Установить зависимости
- Реализовать верстку шаблона в пространстве /template:
    - в папке css/ стили
    - в папке js/ модули
    - в папке pug/layouts pug-шаблоны наследуюемые другими страницами шаблоны
    - в папке pug/meta pug-шаблон meta-элементов (шапка, подвал)
    - в файле template_styles.js поключение стилей (из папки css/)
    - в файле template_modules.js инициализация модулей (из папки js/)       
- Реализовать верстку включаемых областей в пространстве /template/includes
    - в папке css/ стили
    - в папке js/ модули
    - в папке pug/ pug-шаблоны
    - в файле includes_styles.js поключение стилей (из папки css/)
    - в файле includes_modules.js инициализация модулей (из папки js/) 
- Реализовать верстку шаблонов компонентов в пространстве /components/название компонента (название в camelCase нотации)
    - в файле template.pug pug-шаблон
    - в файле style.scss стили
    - в файле style.js поключение стилей (файл аstyle.scss)
    - в папке modules/ модули, используемые внутри компонета
    - в файле component.js реализация модуля компонета
    - в файле script.js поключение и инициализация модуля компонента (из файла component.js)
    - примечание: нельзя менять название и расположение файлов, отвечающих за подключение и инициализацию (style.js и script.js), но остальную структуру можно  изменять, однако такое допустимо, когда стилей, pug-шаблонов и вариаций component.js становится много, в таком случае структура следующая:
        - в pug/ pug-шаблоны
        - в css/ стили
        - в js/ модули компонента (то есть его вариации)
        - в папке modules/ модули, используемые внутри компонета
        - в файле style.js поключение стилей
        - в файле script.js поключение и инициализация модуля компонента
- Для подключения модулей использовать алиасы:
    - @: ./src,
    - @template: ./src/template
    - @includes: ./src/includes
    - @components: ./src/components
    - @utils: ./src/utils

## Правила ведения репозитория
- Называть репозиторий по маске: bitrix-название_сайта-frontend

## Допилить
- Добавить стайл-гайд
- Дополнить раздел Правила ведения репозитория
- ~~Добавить удаление файлов в билде, подключающих стили~~
- Добавить удаление служебных постфиксов (.styles и .scripts) у папок и файлов в билде
