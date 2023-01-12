# screen-capture

## Setup
### Add files to secret
- copy `.env.sample` and paste as `.env`

## Start
```
yarn install
node index.js
```

## Run
### Start generating thumbs for given ids range in size 1600 x 1600
```
node index.js --from 0 --to 239
```

### Start generating a thumb for given ids
ex. generate thumbs for id=10, 11
```
node index.js --ids 10 11
```

### Start generating a thumb for given ids in specific size
ex. generate thumbs for given ids range in specific size
```
node index.js --from 0 --to 239 --size s800
```

### Start generating a thumb for given ids with delay
ex. generate thumbs for given ids range with 1000ms delay  
This will solve the issue that sometimes thumbnail isn't created if the process is heavy.
```
node index.js --from 0 --to 239 --delay 1000
```