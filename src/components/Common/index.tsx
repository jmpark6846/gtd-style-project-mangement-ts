import styled from 'styled-components'

interface ButtonProps {
  small?: boolean
  minimal?: boolean
}
export const Button = styled.button<ButtonProps>`
  max-width: 100%;
  padding: 0.5em 1.2em;
  border: 1px solid #d9d9d9;
  border-radius: 1.5em;
  line-height: 1.5;
  background-color: #fff;
  vertical-align: middle;
  text-decoration: none;
  text-align: center;
  white-space: normal;
  cursor: pointer;

  font-size: ${props => props.small && '0.9rem'};
  padding-top: ${props => props.small && '0.425em;'};
  padding-bottom: ${props => props.small && '0.425em;'};
  border: ${props => props.minimal && 'none'};

  :hover {
    background-color: #f7f7f7;
  }
`

export const Checkbox = styled.input``
