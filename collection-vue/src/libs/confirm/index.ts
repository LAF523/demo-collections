import { render } from 'vue';
import Confirm, { Props } from './index.vue';

export const confirm = ({ title, content, onClose, onConfirm, onCancel, confirmText, cancelText }: Props) => {
  const close = () => {
    render(null, document.body);
    if (typeof onClose === 'function') {
      onClose();
    }
  };
  const vnode = h(Confirm, {
    title,
    content,
    onConfirm,
    onCancel,
    onClose: close,
    confirmText,
    cancelText
  });
  render(vnode, document.body);
};
