# Syntax
Learn the syntax of 📦.

# Contents
* [Structure](#structure)
* [Data Types](#data-types)
* [Create 📦](#create-)
* [Delete 📦](#delete-)
* [Expressions](#expressions)
* [If Else](#if-else)
* [Functions](#functions)
* [Result and Input](#result-and-input)
* [Lists](#lists)
* [Loops](#loops)

## Structure
To do anything in 📦, you **must** store the result into a 📦:
```
<Actions> -> <Target>
<Target> <- <Actions> # You can also do the other way round.
```

You can do as many actions as you can ever possibly wish for, as long as you use `|` to split them:
```
<Target> <- <Action> | <Action>
<Action> | <Action> -> <Target> # It does the same thing, just different direction.
```
(It'll  always execute from left to right.)

## Data Types
Like most of the programing languages, 📦 have: `<string>`, `<number>`, `<boolean>`, `<empty>`, `<list>`, and some other unique data types, like: `<fire>`, `<actionList>`, `<inputList>`. 📦 don't have `<object>`, because:

**why the hell would you ever need an object when you already have list?**

Just kidding, it's just a joke. [or is it?](https://youtu.be/TN25ghkfgQA?si=4LEfLodD4PVCsSpI&t=2)

* string: `'aString'` or `"aString"`
* number: `123` `-123` `123.4`
* boolean: `Yes` or `No`
* empty: `Empty`
* fire: `Fire`
* list: `[123, Yes, Empty]`
* actionList: `{ 1 | Result+2 | Result+3 }`
* inputList: `(123, Yes, Empty)`


## Create 📦
You can create a 📦 by adding a `+` to the start of the target name:
```
+aBox <- 1
```
You can also create a locked box by adding a `@` behind `+`:
```
+@aLockedBox <- 1
```

## Delete 📦
You can delete a 📦 by "giving" it a `<Fire>`, so you can burn it:
```
+aBox <- Yes
aBox <- Fire
```

## Expressions
You can use expressions to do many cool things, like... math?
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
You can also do something like:
```
+aBox <- 1 == 1 || 1 == 1
```
But I can't guarantee that it will work as expected, because I'm just simply not smart enough to write a VM (Yes, it's done in the VM) that's smart enough to do that.

## If Else
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

