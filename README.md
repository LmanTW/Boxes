# 📦 Boxes
A funny programing language which is about 📦.

> [!WARNING]
> Please don't use 📦 to make any serious project.

## Example
Here's a an over-engineered example for printing `hi!`:
```
+anArray <- ['h', 'i', '!'] # Create a new box.
+@main <- anArray(0)+anArray(1) > Result+anArray(2) > print(Result) # Add all the letters together.
```

# Contents
* [Structure](#structure)
* [Create Boxes](#create-boxes)
* [Data Types](#data-types)

## Structure
To do anything in 📦, you **must** store the ~~hardwork~~ aka result into a 📦:
```
<Actions> -> <Target>
<Target> <- <Actions> # You can also do the other way round.
```
* Target is equal to 📦
* Action will eventually become result

You can do as many actions as you can ever possibly wish for, as long as you use `>` to split them:
```
<Target> <- 1 > Result+2 > Result+3
1 > Result+2 > Result+3 > <Target> # It does the same thing, just different direction.
```

## Create Boxes
You can create a box by adding a `+` to the start of the target name:
```
+aBox <- 1
```
You can also create a locked box by adding `@` behind `+`:
```
+@aLockedBox <- 1
```

## Data Types
Like most of the programing languages, 📦 have `string`, `number`, `boolean`, `empty`, `array`, 📦 don't have a object, because **why the hell would you ever need a object when you already array**? Just kidding, it's just a joke. [or is it?](https://youtu.be/TN25ghkfgQA?si=4LEfLodD4PVCsSpI&t=2)
