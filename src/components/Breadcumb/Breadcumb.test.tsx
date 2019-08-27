import React from 'react'
import { render } from '@testing-library/react'
import { Breadcumb } from './Breadcumb'

test('프로젝트와 리스트 명을 제대로 표시한다', () => {
  const { getByText } = render(
    <Breadcumb
      paths={[{ id: 'aaa', title: '테스트 프로젝트 ' }, { id: 'bbb', title: '테스트 리스트 ' }]}
    />
  )
  getByText('테스트 프로젝트')
  getByText('테스트 리스트')
})
