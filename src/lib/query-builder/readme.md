# Search query language

## Query structure and terminology

A query clause consists of a field followed by an operator followed by a value:

|          |                            |
| -------- | -------------------------- |
| clause   | email:"amy@rocketrides.io" |
| field    | email                      |
| operator | :                          |
| value    | amy@rocketrides.io         |

## Search Syntax

The following table lists the syntax that you can use to construct a query.

| SYNTAX                                         | USAGE                                      | DESCRIPTION                                                | EXAMPLES                                                                      |
| ---------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| <mark>:</mark>                                 | <mark>field:value</mark>                   | Exact match operator                                       | <mark>email:"nigel.tran@gmail.com"</mark>                                     |
| <mark>AND</mark> or <mark>and</mark>           | <mark>field:value1 AND field:value2</mark> | The query returns only records that match both clauses     | <mark>status:"active" AND amount:500</mark>                                   |
| <mark>OR</mark> or <mark>or</mark>             | <mark>field:value1 OR field:value2</mark>  | The query returns records that match either of the clauses | <mark>currency:"usd" OR currency:"eur"</mark>                                 |
| <mark>-</mark>                                 | <mark>-field:value</mark>                  | Returns records that don’t match the clause                | <mark>-currency:"jpy" returns records that aren’t in JPY</mark>               |
| <mark>NULL</mark> or <mark>null</mark>         | <mark>field:null</mark>                    | A special token used for field presence (case insensitive) | <mark>url:null returns records where a url field is empty</mark>              |
| <mark>\</mark>                                 | <mark>" \"\""</mark>                       | Escape quotes within quotes                                | <mark>description:"the story called \"The Sky and the Sea.\""</mark>          |
| <mark>~</mark>                                 | <mark>field~value</mark>                   | Substring match operator                                   | <mark>email~"amy" returns matches for amy@rocketrides.io and xamy</mark>      |
| <mark>></mark>, <mark><</mark>, <mark>=</mark> | <mark>field<=value</mark>                  | Greater than/less than operators                           | <mark>amount>="10"</mark> brings up objects where the amount is 10 or greater |
