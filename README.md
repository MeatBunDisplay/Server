# Server
サーバーです

## ライセンス
本ソフトウェアでは表示フォントに「M PLUS Rounded 1c」(https://fonts.google.com/specimen/M+PLUS+Rounded+1c) を使用しています。  
本フォントはOpen Font License(https://github.com/MeatBunDisplay/Server/blob/main/LICENSE.txt) のもとで提供されています。  
©2016 Google Fonts, ©2016 自家製フォント工房, © 2016 M+ FONTS PROJECT  
「M PLUS Rounded 1c」を除く本ソフトウェアの著作権はGODofMEGANEとminfaox3が所有しています。  

## データベース操作
### インストール
* MySQL80系推奨
    * 80以上なら
    * `ALTER USER '特権ユーザー名'@'localhost' IDENTIFIED WITH mysql_native_password BY 'パスワード';`
    * を実行
* mysqlパッケージ(npm)
    * `npm install mysql`
### 初期化
`init.sql`のSQL文を実行する。この時点で列は10個用意される。
### 初期設定
`server.js`の`connection`に対して設定している初期値`mysql.createConnection`に渡す引数は
```
{
    host: 'localhost',
    user: 'root', //特権ユーザー名
    password: 'mokemoke', //上記ユーザーのパスワード
    database: 'MeatButDB'
}
```
### アクセス方法
#### 前提
`database.js`を読み込む。
#### 使い方
##### 対GET
`get_request(URL, コールバック関数名);`
##### 対POST
`post_request(URL, JSONデータ,コールバック関数名);`
##### コールバック関数例
サーバー側での操作が終わるとコールバック関数が呼ばれる。
コールバック関数の引数には、JSON（成功時はデータ・失敗時はエラーメッセージ）が渡される。
```
function callback_function(object) {
    //console.log(object);
}
```
### URLの種類
#### /db/get_place
##### メソッド：GET
##### レスポンス例
###### 成功
```
[
    {"PlaceID":2,"Type":null},
    {"PlaceID":3,"Type":null},
    ...
    {"PlaceID":10,"Type":null},
    {"PlaceID":1,"Type":"a35c314d-8b40-11ed-a7c9-b025aa3cb740"}
]
```
###### 失敗
`エラー内容`
#### /db/get_type
##### メソッド：GET
##### レスポンス例
###### 成功
```
[
    {
        "ID":"0fe719ea-8b2f-11ed-a7c9-b025aa3cb740",
        "Name":"ダミーマン",
        "Price":100,
        "Time":"00:05:00",
        "Description":"ダミーの肉まんです",
        "ImageSrc":null,
        "CreateTime":"2023-01-03T06:22:56.000Z",
        "UpdateTime":"2023-01-03T06:22:56.000Z"
    }
    ...
]
```
###### 失敗
`エラー内容`
#### /db/get_meatbut
##### メソッド：GET
##### レスポンス例
###### 成功
```
[
    {
        "ID":"de704fa9-8b4a-11ed-a7c9-b025aa3cb740",
        "Type":"c0bc1497-8b40-11ed-a7c9-b025aa3cb740",
        "Number":1,
        "StartTime":"2023-01-03T09:41:59.000Z",
        "EndTime":"2023-01-03T09:46:59.000Z"
    }
    ...
]
```
###### 失敗
`エラー内容`
#### /db/add_place
##### メソッド：POST
列の選択肢を増やす。  
##### リクエストデータ
`place`の重複は不可。`type`の重複は可。
###### ケース1
`{"place": 整数}`
###### ケース2
`{"place": 整数, type: UUID文字列}`
##### レスポンス例
###### 成功
`{"status": "SUCESS"}`
###### 失敗
`エラー内容`
#### /db/add_type
肉まんの種類を増やす。
##### メソッド：POST
##### リクエストデータ
蒸し時間の指定例(5分)：`"0500"`
```
{
    "name": 文字列,
    "price": 整数,
    "time": 文字列(時間),
    "description": 文字列
}
```
##### レスポンス例
###### 成功
`{"status": "SUCESS"}`
###### 失敗
`エラー内容`
#### /db/add_meatbut
##### メソッド：POST
肉まんを増やす。
##### リクエストデータ
`number`は列の置き場所。重複禁止。
###### ケース1
始まりの時間はPOST時の現在時刻。
```
{
    "type": UUID文字列,
    "number": 整数
}
```
###### ケース2
始まりの時間を指定する。  
時間文字列例①:`2023-01-04 01:23`  
時間文字列例②:`2023-01-04 01:25:45`  
```
{
    "type": UUID文字列,
    "number": 整数,
    "start_time": 時間文字列
}
```
##### レスポンス例
###### 成功
`{"status": "SUCESS"}`
###### 失敗
`エラー内容`
#### /db/update_place
列に登録されている肉まんの種類を変更。
##### メソッド：POST
##### リクエストデータ
`place`に選択する列を指定。
```
{
    "place": 整数,
    "type": UUID文字列
}
```
#### /db/update_meatbut
肉まんの置き場所を変える。
##### メソッド：POST
##### リクエストデータ
`id`は肉まんの文字列。
```
{
    "id": UUID文字列,
    "type": UUID文字列,
    "number": 整数
}
```
#### /db/delete_place
##### メソッド：POST
##### リクエストデータ
`{"place": 番号}`
##### レスポンス例
###### 成功
`{"status": "SUCESS"}`
###### 失敗
`エラー内容`
#### /db/delete_type
##### メソッド：POST
##### リクエストデータ
`{"type": UUID文字列}`
##### レスポンス例
###### 成功
`{"status": "SUCESS"}`
###### 失敗
`エラー内容`
#### /db/delete_meatbut
##### メソッド：POST
##### リクエストデータ
`id`は肉まんの文字列。
```
{
    "id": UUID文字列,
    "type": UUID文字列
}
```
#### /db/manual_control
##### メソッド：POST
直接SQL文をリクエストできる。
##### リクエストデータ
`{"sql":文字列}`
##### レスポンス例
###### 成功
`結果`
###### 失敗
`エラー内容`
