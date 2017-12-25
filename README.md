# SushiDeliver
- a game delivering "sushi" to couples.

## How To Install
- Clone the repo
`git clone https://github.com/azuki-penguin/SushiDeliver.git`

- move to the repo directory and clone enchant.js repo
```
cd SushiDeliver
git clone https://github.com/wise9/enchant.js.git
```

- install grunt and coffee script if not installed
```
which -s grunt || npm install grunt-cli -g
which -s coffee || npm install coffee-script -g
```

- build enchant.js and create link to enchant.min.js
```
cd enchant.js
grunt concat
grunt uglify
ln enchant.min.js ../
```

## materials
- illustration
  - [いらすとや](http://www.irasutoya.com/)
