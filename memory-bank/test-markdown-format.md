# Test Markdown Linting

This file has some intentional issues that markdownlint should fix automatically.

- Inconsistent list item spacing

- Should be fixed with proper spacing

*emphasis with no spaces*
**strong with no spaces**

### Heading with no spacing above

Text immediately following heading with no space.

```js
// code block with no language specified
const test = "this should be fine";
```

- [ ] Incomplete task list item
- [x] Complete task list item

> Blockquote with no space.
Another line that should be part of the blockquote.

   Too many spaces at the start of this line.

## Table with formatting issues

|  Column 1 |Column 2| Column3|
|--|--|--|
|value 1|  value 2|value 3 |
