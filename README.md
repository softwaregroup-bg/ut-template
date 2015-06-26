# UT Template

The UT template engine is based on Marko with some enhancements

## Marko template engine Resources

* https://github.com/raptorjs/marko
* http://raptorjs.org/marko/try-online

## API

1. Here is how you load and render a template. Note that using require.resolve is **mandatory**.

    ```javascript
    //require the engine and init it with bus.
    //.init(bus) is only required if a template will be using the tags that invoke methods from the bus.
    var utTemplate = require('ut-template').init(bus);

    //load the template (once)
    var template = utTemplate.load(require.resolve('./test.sql.marko'));

    //render the template (many times)
    template.render({paramName1:'paramValue1'}).then(function(result){
        //handle template result
    }).catch(function(error){
        //handle template error
    })
    ```

## Enhancements

Here are the enhancements to the Marko engine

1. Some default logic is applied to templates with the following extensions *.sql.marko, *.json.marko, *.csv.mako
    * Whitespace preserving is turned automatically on
    * Escaping is automatically applied as follows:
        * For *.sql.marko - values are wrapped in N'value' and single quotes are escaped (i.e. replaced with two single quotes).
          Values that are null/undefined are being output as null.
        * For *.json.marko - values are JSON stringified and wrapped in double quotes

1. Bus methods can be called using the follwing tag syntax:

    ```xml
    <ut-namespace:method var="result" name1="value1" name2="value2">
        namespace.method({name1:'value1', name2:'value2'}) returned result ${result}
    </ut-namespace:method>
    ```

## Examples and replacements

#### Correct way of using switch (prev known as sg:switch)

```xml
<with vars="name = ${s.method};">
    <if test="name === 'add-sms'">
        <include template="include some template"/>
    </if>
    <if test="name === 'closeaccount'">
        <include template="include some template"/>
    </if>
</with>
```

#### Correct way of using sql template (prev known as sg:sql)
no more sg:sql tag, every call to db will be handled by [ut-port-sql](https://git.softwaregroup-bg.com/ut5/ut-port-sql/tree/master#sql-port-ut-port-sql) and db will be queried trough it whit help of special constructed message

```xml
<ut-db:getproducts var="products">
    ${products}
</ut-db:getproducts>
```

where `db` is db named namespace(wchi is actually a message destination field), `getproducts` is the operation code / method and `products` is the streamed response
 
#### Internationalization
Internationalization within the ut-template engine could be achieved in 2 ways:

 1. by surrounding the label in square brackets:
 **``` $[label] ```**
 2. by calling a function 't' which is available within the scope of every template by default:
**``` ${t('label')}```**

The translations themselves must be provided by the implementation that is currently running. Within the impl folder there should be a json file with all the translations for the implementation.
The files format should be as follows:

```js
{
    "en" : {
        "label1" : "label1 translation in English",
        "label2" : "label2 translation in English",
        ...
    },
    "fr" : {
        "label1" : "label1 translation in French",
        "label2" : "label2 translation in French",
        ...
    },
    ...
}
```

the json file with all the translation should be specified in implementation's config.json as follows:

```js
{
    ...
    "translations": "translations.json"
}
```

The file path specified should be absolute but relative to implementation's root directory. E.g. for the case above the file should be located in the root directory. If it was for example "translations/collection.json" then the file should be called collection.json and should be located inside a 'translations' folder within the root directory.


----------


 @todo - link to "what is namespace and opcode/method" documentation