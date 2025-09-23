## 우산 대여 시스템 구축 SE
### 프로젝트 소개

### 기술 스택

### Getting Start

### `.env`, `gitignore` settings

### Codeing Conventions & Strategy


## 각 단계별 필요 산출물(분석 ~설계)
### 1. 계획 단계

### 2. 분석 단계
`SRS` : Software Requirements Specification, 기능 및 비기능 요구사항을 체계적으로 정리한 공식 문서

`UseCase Diagram & Specification` : 사용자(Actor)와 시스템 간의 상호작용을 시나리오 형태로 설명하는 다이어그램과 문서

`화면 설계서` : Figma를 주로 이용하여 생성하는 경우가 대다수로 사용자가 보게 될 화면과 구조 및 흐름을 시각적으로 보여주는 문서

### 3. 설계 단계

#### 3-1. 공통 아키텍처 설계
`Architecture Diagram` : 전체적으로 소프트웨어의 각 부분들이 어떻게 구성되고 상호작용하는지를 보여주는 문서

`Deployment Diagram` : 어떤 소프트웨어 스택이 물리적으로 어디에 설치되고 실행되는지를 보여주는 문서

#### 3-2. 백엔드 설계
`ERD` : Entity Relationshiop Diagram

`API Specification`

#### 3-3. 프론트엔드 설계
`Component Diagram/Tree` : 피그마 화면을 어떤 React 컴포넌트로 나눌지 설계한 그림으로, 예를 들면 메인 페이지는 Header, UmbrellaList, Footer 컴포넌트로 구성되고, UmbrellaList는 여러 개의 UmbrellaItem 컴포넌트로 이루어진다는 것을 시각적으로 표현하는 다이어그램

`페이지 라우팅 설계서` : 어떤 주소로 접속하면 어떤 페이지 컴포넌트를 보여줄지 정의한 목록

`State Management 전략` : 어떤 데이터를 전역으로 관리하고, 컴포넌트 내부에서 관리할지 규칙으로 정한 문서(API 호출의 위치와 시점도 정의)
