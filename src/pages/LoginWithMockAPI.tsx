import React, { useState } from 'react'

type LoginSuccessMessage = 'SUCCESS'
type LoginFailMessage = 'FAIL'

//#region Type 정의
interface LoginResponse {
  message: LoginSuccessMessage | LoginFailMessage
  token: string
}

interface UserInfo {
  name: string
}

interface User {
  username: string,
  password: string,
  userInfo: UserInfo
}
//#endregion

//#region demo User 데이터
const users: User[] = [
  {
    username: 'blue',
    password: '1234',
    userInfo: { name: 'blueStragglr' }
  },
  {
    username: 'white',
    password: '1234',
    userInfo: { name: 'whiteDwarf' }
  },
  {
    username: 'red',
    password: '1234',
    userInfo: { name: 'redGiant' }
  },
]
//#endregion

const _secret: string = '1234qwer!@#$'

// username, password를 사용하여 demo data에 확인한 뒤 로그인 결과와 token 정보를 리턴하는 함수
const login = async (username: string, password: string): Promise<LoginResponse | null> => {
  const user: User | undefined = users.find((user: User) => {
    return user.username === username && user.password === password
  })
  return user
    ? {message: 'SUCCESS', token:JSON.stringify({user: user.userInfo, secret: _secret})}
    : null
}

const getUserInfo = async (token: string): Promise<UserInfo | null> => {
  const parsedToken = JSON.parse(token)
  if (!parsedToken?.secret || parsedToken.secret !== _secret) return null

  const loggedUser: User | undefined = users.find((user: User) => {
    if(user.userInfo.name === parsedToken.user.name) return user
  })
  return loggedUser ? loggedUser.userInfo : null
}

const LoginWithMockAPI = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({name: ''})
  
  // submit 버튼 클릭 시 실행되는 핸들러 함수
  const loginSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const loginRes = await login(formData.get('username') as string, formData.get('password') as string)
    if(!loginRes) return

    const userInfo = await getUserInfo(loginRes.token)
    if(!userInfo) return
    
    setUserInfo(userInfo)
  }

  return (<div>
    <h1>
      Login with Mock API
    </h1>
    <form onSubmit={loginSubmitHandler}>
      <label>
        Username:
        <input type="text" name="username"/>
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <button type="submit" value="Submit">submit</button>
    </form>
    <div>
      <h2>
        User info
      </h2>
      {JSON.stringify(userInfo)}
    </div>
  </div>)
}

export default LoginWithMockAPI
