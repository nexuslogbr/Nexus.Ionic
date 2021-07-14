export class Pagination<T> {
  page: number = 0;
  totalPerPage: number = 10;
  totalRecords: number = 0;
  data?: Array<T>;

  get hasMoreData(): boolean {
    return this.data == null || this.data.length == this.totalPerPage;
  }
}
