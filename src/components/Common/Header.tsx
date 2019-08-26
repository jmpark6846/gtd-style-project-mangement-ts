import React, { useCallback } from 'react'
import styled from 'styled-components'
import Dropdown, { DropdownItem } from '../Dropdown/Dropdown'
import useAuth from '../../hooks/useAuth'
import { firebaseAuth } from '../../db'
import { RouteComponentProps, navigate, Link } from '@reach/router'
import { User } from '../../types/User'
import logo from '../../assets/apple-icon-180x180.png'

const Nav = styled.nav`
  position: fixed;
  top: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #fdfdfd;
  box-sizing: border-box;
  box-shadow: 0 5px 10px 0 rgba(0, 64, 128, 0.05);
  /* box-shadow: 0 4px 11px rgba(0,0,0,0.1); */
  background-color: #ffffff;
  height: 50px;
  align-items: center;
  z-index: 999;
`

const Logo = styled.span`
  font-weight: 700;
  font-size: 1rem;
  /* color: #daa592; */
`

interface Props {}

export const Header: React.FC<Props> = () => {
  const [user, status] = useAuth()
  const signOut = useCallback(async () => {
    firebaseAuth
      .signOut()
      .then(function() {
        navigate('/')
      })
      .catch(function(error) {
        console.error('error signout: ' + error)
      })
  }, [])
  return (
    <Nav>
      <Logo>
        <Link to={`/projects`}>
          <img src={logo} alt="Logo" style={{ width: '1.3rem', marginRight: '5px' }} />
          gtd-style-project-management
        </Link>
      </Logo>

      <Dropdown select={user.username}>
        <DropdownItem onClick={signOut}>로그아웃</DropdownItem>
      </Dropdown>
    </Nav>
  )
}
