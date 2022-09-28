export enum EStatus {
  ACTIVE = 1,
  INACTIVE = 0,
  PENDING = -1
}

// https://qiita.com/Quramy/items/e27a7756170d06bef22a
export const STATUS = {
  ACTIVE: String(EStatus[EStatus.ACTIVE]).toLowerCase(),
  INACTIVE: String(EStatus[EStatus.INACTIVE]).toLowerCase(),
  PENDING: String(EStatus[EStatus.PENDING]).toLowerCase()
};
