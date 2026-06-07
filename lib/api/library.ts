import { createResourceApi } from './create-resource-api'
import type { BookDto, BookIssueDto } from './types/resources'

export const libraryApi = {
  books: createResourceApi<BookDto>('/library/books'),
  issues: createResourceApi<BookIssueDto>('/library/issues'),
}
