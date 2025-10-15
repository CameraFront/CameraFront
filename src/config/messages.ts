export const ERROR_MESSAGES = {
  500: '서버로부터 정상적인 응답을 받지 못했습니다.',
};

export const SUCCESS_MESSAGES = {
  create: '성공적으로 새 :object 추가되었습니다.',
  update: '성공적으로 해당 :object 수정되었습니다.',
  delete: '성공적으로 해당 :object 삭제되었습니다.',
  clone: '성공적으로 해당 :object 복제되었습니다.',
};

/**
 * 액션과 객체에 기반하여 성공 메시지를 생성합니다.
 *
 * @param action - 수행된 액션 (create, update, 또는 delete)
 * @param object - 액션이 수행된 객체
 * @returns 형식화된 성공 메시지
 *
 * @example
 * // 새로운 객체에 대해 사용하는 방법:
 * const message = getSuccessMessage('create', '사용자가');
 * // 결과: "성공적으로 새 사용자가 추가되었습니다."
 */
export const getSuccessMessage = (
  action: keyof typeof SUCCESS_MESSAGES,
  object: string,
) => SUCCESS_MESSAGES[action].replace(':object', object);
