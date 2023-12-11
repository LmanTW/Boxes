# 語法
學習 📦 的語法。

# 目錄
* [結構](#結構)
* [資料類型](#資料類型)
* [創建 📦](#創建-)
* [刪除 📦](#刪除-)
* [表達式](#表達式)
* [如果否則](#如果否則)
* [函數](#函數)
* [Result 與 Input](#result-與-input)
* [清單](#清單)
* [迴圈](#迴圈)

## 結構
在 📦 裡，你**必須**將結果儲存至一個 📦 裡，不然你媽會打你屁股因為你沒把東西收好:
```
<多個動作> -> <目標>
<目標> <- <多個動作> # 你也可以反過來。
```

你可以執行無限多個的動作，只要你使用 `|` 將它們分開來:
```
<目標> <- <動作> | <動作>
<動作> | <動作> -> <目標> # 它們除了方向以外其他都是一樣的。
```
(所有的動作都會從左執行到右。)

## 資料類型
跟大部分的編程語言一樣，📦 有: `<string>`, `<number>`, `<boolean>`, `<empty>`, `<list>`, 和一些獨特於 📦 的資料類型，像是: `<fire>`, `<actionList>`, `<inputList>`. 📦 沒有 `<object>`, 因為:

**你已經有清單了，為什麼你會需要物件？？？~~做人要知足~~**

開玩笑的，只是一個[玩笑](https://youtu.be/dQw4w9WgXcQ?si=hTfPcr4o9K-CO15X)。

* string: `'aString'` or `"aString"`
* number: `123` `-123` `123.4`
* boolean: `Yes` or `No`
* empty: `Empty`
* fire: `Fire`
* list: `[123, Yes, Empty]`
* actionList: `{ 1 | Result+2 | Result+3 }`
* inputList: `(123, Yes, Empty)`


## 創建 📦
你可以透過在目標名稱的前面添加 `+` 來創建一個 📦:
```
+aBox <- 1
```
你也可以在 `+` 的前面加一個 `@` 來創建一個上鎖的 📦:
```
+@aLockedBox <- 1
```

## 刪除 📦
你可以透過把 📦 "點燃" 來刪除一個 📦:
```
+aBox <- Yes
aBox <- Fire
```

## 表達式
你可以用表達式來做很多的酷東西，像是...數學?
```
+aBox <- Empty

aBox <- 1+1 # Addition
aBox <- 1-1 # Subtraction
aBox <- 1*1 # Multiplication
aBox <- 1/1 # Division

aBox <- 1 == 1 # Equal
aBox <- 1 > 0 # Greater than
aBox <- 1 >= 0 # Greater than or equal to
aBox <- 0 < 1 # Less than
aBox <- 0 <= 1 # Less than or equal to

aBox <- Yes || No # Or
aBox <- Yes && Yes # And

aBox <- aBox = 1 # Set box
```
你也可以這樣:
```
+aBox <- 1 == 1 || 1 == 1
```
但我不能保證那會像預期的一樣運行，因為我還沒有聰明到可以寫出一個虛擬機 (對，那是在虛擬機裡完成的) 來做到這個功能。

## 如果否則
You can do If Else operation in 📦 by using `?` and `:` operator:
```
+@main <- <condiTion> ? <actionList> # If (If condition is true, execute {actionList})
# or
+@main <- <condiTion> ? <actionList> : <actionList2> # If Else (If condition is true, execute {actionList} else execute {actionList2})
```

## Functions
We all love functions, so to make 📦 as likeable as possible, we also have functions. you can create a function using `<actionList>`:
```
+@aFunction = { Input(0)*Input(1) | Result/2 } # I'll suggest locking this 📦.
```
When you're using a `<actionList>`, the actions inside of it will not be executed until you call the function. you can call a function by using `<inputList>`:
```
+@aFunction = { Input(0)*Input(1) | Result/2 }

+@main <- print(aFunction(2, 5)) # 5
```
You can run a function in async by adding a `~` before the function name:
```
+@aFunction = { Input(0)*Input(1) | Result/2 }

+@main <- print(~aFunction(2, 5)) # Promise
```
(It'll always return a `<promise>`)

## Result and Input
`Result` and `Input` are the only "local" 📦 in 📦, `Result` is the result from previous action:
```
+@doMath <- 1 + 1
+@main <- doMath() | print(Result) # 2
```
`Input` is the input when you call the function, Input will always be a `<list>`:
```
+@aFunction <- print(Input(0), Input(1))
+@main <- aFunction(0, 1) # 0, 1
```

## Lists
Lists are lovely, you can use `<list>` to do all kind of cool stuff, you can use `<inputList>` to read / set / remove a item from list using an index:
```
+aList <- [0, 1, 2]

+main <- print(aList(0)) # Read item 0 from the list, the result is: 0
main <- print(aList(0) = 1) # Set item 0 to 1
main <- print(aList(0) = Fire) # Remove item 0
```
(The index starts at 0)

## Loops
Loops are not built in in 📦, but you can still "make" one:
```
+@loop <- { Input(0) < 100 ? { print(Input(0)) | ~loop(Input(0)+1) }}

+@main <- ~loop(0)
```
(I use async to increase performance, because the chunks don't need to wait for their child chunk, there for there's less chunks.)

