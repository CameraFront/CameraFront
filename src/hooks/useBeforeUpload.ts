import { FileConstraints } from '@/types/common';
import { App, Upload, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useCallback } from 'react';

// 파일 업로드 전에 파일의 확장자, 크기, 이미지 사이즈를 체크하는 Custom Hook
const useBeforeUpload = ({ extensions, size, dimension }: FileConstraints) => {
  const { modal } = App.useApp();

  const normFile = useCallback((e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  }, []);

  const handleBeforeUpload = useCallback<
    NonNullable<UploadProps['beforeUpload']>
  >(
    async file => {
      const validExtensions = extensions.map(ext => ext.toLowerCase());
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension || !validExtensions.includes(extension)) {
        modal.error({
          title: '지원하지 않는 파일 형식입니다.',
          content: `${extensions
            .map(ext => ext.toUpperCase())
            .join(',')} 파일만 업로드 가능합니다..`,
        });
        return Upload.LIST_IGNORE;
      }

      const maxSize = size * 1024 * 1024;
      if (!file.size || file.size > maxSize) {
        modal.error({
          title: '파일 제한 용량을 초과합니다.',
          content: `최대 ${size}MB까지 업로드 가능합니다.`,
        });
        return Upload.LIST_IGNORE;
      }

      if (!dimension) return false;

      const checkImageSize = async (file: RcFile): Promise<boolean> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = e => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
              if (
                img.width > dimension.width ||
                img.height > dimension.height
              ) {
                reject('inValidSize');
              } else {
                resolve(true);
              }
            };
            img.onerror = () => reject('failToLoadImage');
          };
        });
      };

      try {
        const isValidSize = await checkImageSize(file);
        return isValidSize ? false : Upload.LIST_IGNORE;
      } catch (error) {
        if (error === 'inValidSize') {
          modal.error({
            title: '이미지의 사이즈가 맞지 않습니다.',
            content: `가로 ${dimension.width}px, 세로 ${dimension.height}px 사이즈의 이미지만 업로드 가능합니다.`,
          });
        } else if (error === 'failToLoadImage') {
          modal.error({
            title: '이미지를 불러오지 못했습니다.',
            content: '다른 파일을 시도해 주세요.',
          });
        }

        return Upload.LIST_IGNORE;
      }
    },
    [dimension, extensions, modal, size],
  );

  return { normFile, handleBeforeUpload };
};

export default useBeforeUpload;
