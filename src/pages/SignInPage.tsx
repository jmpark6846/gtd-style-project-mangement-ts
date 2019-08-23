import React from 'react'
import { RouteComponentProps } from '@reach/router'
import styled from 'styled-components'
import { Input, Button } from '../components/Common'

const SignInPagePane = styled.div`
  h2.title {
    font-weight: 700;
    font-size: 1.7rem;
  }
  .signin-form {
    margin-top: 20px;
  }
  .field {
    margin-bottom: 13px;
  }
  .control-pane {
    display: flex;
    justify-content: space-between;
  }
`

interface Props extends RouteComponentProps {}

export const SignInPage: React.FC<Props> = () => {
  return (
    <SignInPagePane>
      <h2 className="title">Sign In</h2>
      <div className="signin-form">
        <div className="field">
          <Input placeholder="email" />
        </div>
        <div className="field">
          <Input placeholder="password" />
        </div>
      </div>
      <div className="message"></div>
      <div className="control-pane">
        <Button>회원가입</Button>
        <Button>로그인</Button>
      </div>
    </SignInPagePane>
  )
}
