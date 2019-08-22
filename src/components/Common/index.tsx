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

interface PaneProps {
  width?: string
  position?: string
  padding?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
}

export const Pane = styled.div.attrs((props: PaneProps) => ({
  width: props.width,
  position: props.position,
  padding: props.padding,
  marginTop: props.marginTop,
  marginBottom: props.marginBottom,
  marginLeft: props.marginLeft,
}))`
  background-color: white;
  width: ${props => props.width};
  position: ${props => props.position};
  padding: ${props => props.padding};
  margin-top: ${props => props.marginTop};
  margin-bottom: ${props => props.marginBottom};
  margin-left: ${props => props.marginLeft};
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
  border: ${props => (props.minimal ? 'none' : 'initial')};
  margin-bottom: ${props => props.marginBottom};
`

export const Heading = styled.h2`
  font-weight: 700;
  font-size: 1.7rem;
`
