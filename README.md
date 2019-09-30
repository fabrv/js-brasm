# Brasm
Brasm is one more compiler.

## Usage
1. Clone the repo
```bash
git clone https://github.com/fabrv/js-brasm.git
cd js-brasm
```
2. Install dependencies
```bash
npm i
```
3. Start program
```bash
node -r esm <filename> [options]
```
**Options:**  
| Option                    | Description                                                                      |
|---------------------------|----------------------------------------------------------------------------------|
| `--o <output file name>`    | Sets de file where the compiler will output.                                     |
| `--target <stage>`          | Runs up to a stages can be `scan`, `parse`, `ast`, `semantic`, `irt`, `codegen`. |
| `--opt <optimzation stage>` | Sets the stage of optimization; `constant`, `algebraic`.                         |
  
Or just run `npm start` for a setup wizard.
## Config files
1. `regex/tokensRegex.json`, includes all the tokens in Regex
2. `regex/grammar.json`, includes the grammar rules