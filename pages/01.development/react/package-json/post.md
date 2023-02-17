# package.json

## dependencies vs devDependencies

yarn을 이용하여 패키지를 설치할 때,

해당 패키지가 런타임에 쓰인다면(dependencies에 관리하고 싶으면) 아래 방식으로 한다.

```sh
yarn add 패키지_이름
```

해당 패키지가 빌드 타임에 쓰인다면(devDepdendencies에 관리하고 싶으면) 아래 방식으로 한다.

```sh
yarn add --dev 패키지_이름
```
