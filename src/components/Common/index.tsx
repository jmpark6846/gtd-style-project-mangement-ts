import styled from 'styled-components'

interface ButtonProps {
  small?: boolean
  minimal?: boolean
  marginRight?: string
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
  margin-right: ${props => props.marginRight};

  :hover {
    background-color: #f7f7f7;
  }
`

export const IconButton = styled(Button)`
  padding: 0.5rem;
  line-height: 1;
  font-size: 1rem;
  border: none;
`

export const Checkbox = styled.input``

export interface PaneProps {
  width?: string
  position?: string
  padding?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  right?: boolean
}

export const Pane = styled.div<PaneProps>`
  background-color: white;
  width: ${props => props.width};
  position: ${props => props.position};
  padding: ${props => props.padding};
  margin-top: ${props => props.marginTop};
  margin-bottom: ${props => props.marginBottom};
  margin-left: ${props => props.marginLeft};
  margin-right: ${props => props.marginRight};
`

export const Box = styled(Pane)`
  border: 1px solid #d9d9d9;
  border-radius: 1rem;
  padding: 1em 1.5em;
  box-shadow: 0 5px 10px 0 rgba(0, 64, 128, 0.05);
`

interface InputProps {
  marginBottom: string
  minimal: boolean
}
export const Input = styled.input.attrs((props: InputProps) => ({
  marginBottom: props.marginBottom,
  minimal: props.minimal,
}))`
  width: 100%;
  border: ${props => (props.minimal ? 'none' : '1px solid #bfbfbf')};
  border-radius: 5px;
  padding: ${props => (props.minimal ? '0' : '10px')}
  background-color: #fff;
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-transition: box-shadow 0.15s ease-in-out;
  -moz-transition: box-shadow 0.15s ease-in-out;
  -ms-transition: box-shadow 0.15s ease-in-out;
  transition: box-shadow 0.15s ease-in-out;
  text-decoration: none;
  white-space: normal;
  vertical-align: middle;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: ${props => props.marginBottom};

  :focus {
    outline: none;
    border-color: #a4d2ff;
    box-shadow: ${props => (props.minimal ? 'none' : '0 0 6px rgba(27, 106, 201, 0.5)')};
  } 

`

export const Heading = styled.h2`
  font-weight: 700;
  font-size: 2rem;
`

export const Label = styled.label`
  padding: 0.4rem 0.5rem;
  margin-left: 5px;
  border-radius: 5px;
  background-color: palevioletred;
  font-size: 0.8rem;
  color: white;
`
