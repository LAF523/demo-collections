// 引入测试库函数，用来 mocking 模拟操作
import { render, fireEvent } from '@testing-library/react';
// 引入测试 api ，用来编写用例的逻辑
import { describe, it, expect, vi } from 'vitest';
// describe 定义一个用例集合,用于测试一个组件多个测试点
// it 同test 定义一个测试用例
// expect 用来断言，期望

// 引入被测试组件
import Button from '@/components/button';

// 测试思路:
// 1.需要测试什么
//    1.点击按钮是否触发回调函数
//    2.传递参数disabled是否禁用按钮

describe('click and disabled', () => {
  it('test click', () => {
    // 生成测试所需的函数,用于传递给button
    const handleCallback = vi.fn();
    // 渲染button
    const button = render(<Button onClick={handleCallback} />);
    // 组件被渲染之后，通过 getByRole 查询到组件的 dom 节点
    const element = button.getByRole('button');
    // 触发点击事件
    fireEvent.click(element);
    // 检查事件是否被成功触发
    expect(handleCallback).toHaveBeenCalled();
  });
  it('test disable', () => {
    // 生成测试回调函数
    // 渲染button并添加disable属性
    // 获取渲染到的button
    // 触发点击事件
    // 断言点击事件是否未触发
    const handleCallback = vi.fn();
    const button = render(
      <Button
        onClick={handleCallback}
        disabled={true}
      />
    );
    const element = button.getByRole('button');
    fireEvent.click(element);
    expect(handleCallback).not.toHaveBeenCalled();
  });
});
