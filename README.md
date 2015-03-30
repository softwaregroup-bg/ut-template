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

### Correct way of using switch (prev known as sg:switch)

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

### Correct way of using sql template (prev known as sg:sql)

```xml
<ut-db:getproducts var="products">
    ${products}
</ut-db:getproducts>
```
 where `db` is db named namespace, `getproducts` is the operation code / method and `products` is the streamed response
 @todo - link to "what is namespace and opcode/method" documentation