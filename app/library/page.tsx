'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Plus,
  Download,
  BookOpen,
  Users,
  AlertCircle,
  Clock,
  Search,
  BookMarked,
  RotateCcw,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, FormSection, FormField, Tabs } from '@/components/shared/page-components'
import { booksData, bookIssuesData, studentsData, teachersData } from '@/lib/erp-data'
import { bookSchema, bookIssueSchema, type BookFormData, type BookIssueFormData } from '@/lib/schemas'
import type { ColumnDef } from '@tanstack/react-table'

type Book = (typeof booksData)[0]
type BookIssue = (typeof bookIssuesData)[0]

export default function LibraryPage() {
  const [books, setBooks] = React.useState(booksData)
  const [issues, setIssues] = React.useState(bookIssuesData)
  const [activeTab, setActiveTab] = React.useState('books')
  const [showAddBook, setShowAddBook] = React.useState(false)
  const [showEditBook, setShowEditBook] = React.useState(false)
  const [showIssueBook, setShowIssueBook] = React.useState(false)
  const [showReturnBook, setShowReturnBook] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null)
  const [selectedIssue, setSelectedIssue] = React.useState<BookIssue | null>(null)

  const bookForm = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      category: '',
      publisher: '',
      publishYear: new Date().getFullYear(),
      quantity: 1,
      available: 1,
      location: '',
      description: '',
    },
  })

  const issueForm = useForm<BookIssueFormData>({
    resolver: zodResolver(bookIssueSchema),
    defaultValues: {
      bookId: '',
      memberId: '',
      memberType: 'student',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      remarks: '',
    },
  })

  const handleAddBook = (data: BookFormData) => {
    const newBook = {
      id: String(books.length + 1),
      ...data,
      available: data.quantity,
      issued: 0,
    }
    setBooks([...books, newBook])
    setShowAddBook(false)
    bookForm.reset()
  }

  const handleEditBook = (data: BookFormData) => {
    if (!selectedBook) return
    setBooks(books.map((b) => (b.id === selectedBook.id ? { ...b, ...data } : b)))
    setShowEditBook(false)
    setSelectedBook(null)
    bookForm.reset()
  }

  const handleDeleteBook = () => {
    if (!selectedBook) return
    setBooks(books.filter((b) => b.id !== selectedBook.id))
    setShowDeleteConfirm(false)
    setSelectedBook(null)
  }

  const handleIssueBook = (data: BookIssueFormData) => {
    const book = books.find((b) => b.id === data.bookId)
    const member = data.memberType === 'student' 
      ? studentsData.find((s) => s.id === data.memberId)
      : teachersData.find((t) => t.id === data.memberId)
    
    if (!book || !member) return

    const newIssue: BookIssue = {
      id: String(issues.length + 1),
      bookId: data.bookId,
      bookTitle: book.title,
      memberId: data.memberId,
      memberName: member.name,
      memberType: data.memberType,
      class: data.memberType === 'student' ? (member as typeof studentsData[0]).class : null,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      returnDate: null,
      status: 'issued',
      fine: 0,
    }

    setIssues([...issues, newIssue])
    setBooks(books.map((b) => 
      b.id === data.bookId 
        ? { ...b, available: b.available - 1, issued: b.issued + 1 }
        : b
    ))
    setShowIssueBook(false)
    issueForm.reset()
  }

  const handleReturnBook = () => {
    if (!selectedIssue) return
    
    const today = new Date().toISOString().split('T')[0]
    const dueDate = new Date(selectedIssue.dueDate)
    const returnDate = new Date(today)
    const daysLate = Math.max(0, Math.floor((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)))
    const fine = daysLate * 5 // Rs. 5 per day

    setIssues(issues.map((i) => 
      i.id === selectedIssue.id 
        ? { ...i, returnDate: today, status: 'returned', fine }
        : i
    ))
    setBooks(books.map((b) => 
      b.id === selectedIssue.bookId 
        ? { ...b, available: b.available + 1, issued: b.issued - 1 }
        : b
    ))
    setShowReturnBook(false)
    setSelectedIssue(null)
  }

  const bookColumns: ColumnDef<Book>[] = [
    {
      accessorKey: 'title',
      header: 'Book',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">by {row.original.author}</p>
        </div>
      ),
    },
    {
      accessorKey: 'isbn',
      header: 'ISBN',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.isbn}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
    },
    {
      accessorKey: 'quantity',
      header: 'Total',
    },
    {
      accessorKey: 'available',
      header: 'Available',
      cell: ({ row }) => (
        <span className={row.original.available === 0 ? 'text-destructive' : 'text-success'}>
          {row.original.available}
        </span>
      ),
    },
    {
      accessorKey: 'issued',
      header: 'Issued',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionMenu
          actions={[
            { label: 'Issue Book', onClick: () => { setSelectedBook(row.original); issueForm.setValue('bookId', row.original.id); setShowIssueBook(true) } },
            { label: 'Edit Book', onClick: () => { setSelectedBook(row.original); bookForm.reset(row.original); setShowEditBook(true) } },
            { label: 'Delete Book', onClick: () => { setSelectedBook(row.original); setShowDeleteConfirm(true) }, destructive: true },
          ]}
        />
      ),
    },
  ]

  const issueColumns: ColumnDef<BookIssue>[] = [
    {
      accessorKey: 'bookTitle',
      header: 'Book',
    },
    {
      accessorKey: 'memberName',
      header: 'Issued To',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.memberName}</p>
          <p className="text-xs text-muted-foreground capitalize">{row.original.memberType} {row.original.class && `- ${row.original.class}`}</p>
        </div>
      ),
    },
    {
      accessorKey: 'issueDate',
      header: 'Issue Date',
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
    },
    {
      accessorKey: 'returnDate',
      header: 'Return Date',
      cell: ({ row }) => row.original.returnDate || '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'fine',
      header: 'Fine',
      cell: ({ row }) => row.original.fine > 0 ? <span className="text-destructive">Rs.{row.original.fine}</span> : '-',
    },
    {
      id: 'actions',
      cell: ({ row }) => row.original.status === 'issued' && (
        <Button size="sm" variant="outline" onClick={() => { setSelectedIssue(row.original); setShowReturnBook(true) }}>
          <RotateCcw className="h-4 w-4 mr-1" /> Return
        </Button>
      ),
    },
  ]

  const stats = {
    totalBooks: books.reduce((acc, b) => acc + b.quantity, 0),
    availableBooks: books.reduce((acc, b) => acc + b.available, 0),
    issuedBooks: books.reduce((acc, b) => acc + b.issued, 0),
    overdueBooks: issues.filter((i) => i.status === 'overdue').length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Library Management"
          description="Manage books, issues, returns and fines."
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Library' }]}
        >
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Export</Button>
          {activeTab === 'books' ? (
            <Button size="sm" className="gap-2" onClick={() => setShowAddBook(true)}><Plus className="h-4 w-4" />Add Book</Button>
          ) : (
            <Button size="sm" className="gap-2" onClick={() => setShowIssueBook(true)}><BookMarked className="h-4 w-4" />Issue Book</Button>
          )}
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Books" value={stats.totalBooks} change="+15 this month" changeType="positive" icon={BookOpen} />
          <StatCard title="Available" value={stats.availableBooks} change={`${Math.round((stats.availableBooks / stats.totalBooks) * 100)}% available`} changeType="positive" icon={BookOpen} />
          <StatCard title="Issued" value={stats.issuedBooks} change={`${issues.filter((i) => i.status === 'issued').length} active`} changeType="neutral" icon={Users} />
          <StatCard title="Overdue" value={stats.overdueBooks} change="Pending returns" changeType="negative" icon={AlertCircle} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs
            tabs={[
              { id: 'books', label: 'Book Inventory', count: books.length },
              { id: 'issues', label: 'Issue Records', count: issues.length },
              { id: 'overdue', label: 'Overdue', count: stats.overdueBooks },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {activeTab === 'books' ? (
            <DataTable
              columns={bookColumns}
              data={books}
              searchKey="title"
              searchPlaceholder="Search by title, author, or ISBN..."
              filterColumns={[
                { key: 'category', label: 'Category', options: [...new Set(books.map((b) => b.category))].map((c) => ({ label: c, value: c })) },
              ]}
              showRowSelection
            />
          ) : (
            <DataTable
              columns={issueColumns}
              data={activeTab === 'overdue' ? issues.filter((i) => i.status === 'overdue') : issues}
              searchKey="bookTitle"
              searchPlaceholder="Search by book title or member name..."
              filterColumns={[
                { key: 'status', label: 'Status', options: [{ label: 'Issued', value: 'issued' }, { label: 'Returned', value: 'returned' }, { label: 'Overdue', value: 'overdue' }] },
              ]}
            />
          )}
        </motion.div>
      </div>

      {/* Add Book */}
      <SlideOver open={showAddBook} onClose={() => { setShowAddBook(false); bookForm.reset() }} title="Add New Book" description="Add a book to the library inventory." size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowAddBook(false)}>Cancel</Button><Button onClick={bookForm.handleSubmit(handleAddBook)}>Add Book</Button></div>}>
        <BookForm form={bookForm} />
      </SlideOver>

      {/* Edit Book */}
      <SlideOver open={showEditBook} onClose={() => { setShowEditBook(false); setSelectedBook(null); bookForm.reset() }} title="Edit Book" description="Update book information." size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowEditBook(false)}>Cancel</Button><Button onClick={bookForm.handleSubmit(handleEditBook)}>Save Changes</Button></div>}>
        <BookForm form={bookForm} />
      </SlideOver>

      {/* Issue Book */}
      <SlideOver open={showIssueBook} onClose={() => { setShowIssueBook(false); setSelectedBook(null); issueForm.reset() }} title="Issue Book" description="Issue a book to a student or teacher." size="md"
        footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowIssueBook(false)}>Cancel</Button><Button onClick={issueForm.handleSubmit(handleIssueBook)}>Issue Book</Button></div>}>
        <IssueForm form={issueForm} books={books} students={studentsData} teachers={teachersData} />
      </SlideOver>

      {/* Return Confirmation */}
      <ConfirmDialog open={showReturnBook} onClose={() => { setShowReturnBook(false); setSelectedIssue(null) }} onConfirm={handleReturnBook} title="Return Book" description={`Confirm return of "${selectedIssue?.bookTitle}" from ${selectedIssue?.memberName}?`} confirmText="Confirm Return" />

      {/* Delete Confirmation */}
      <ConfirmDialog open={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setSelectedBook(null) }} onConfirm={handleDeleteBook} title="Delete Book" description={`Are you sure you want to delete "${selectedBook?.title}"? This action cannot be undone.`} confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}

function BookForm({ form }: { form: ReturnType<typeof useForm<BookFormData>> }) {
  const { register, formState: { errors }, setValue, watch } = form

  return (
    <div className="space-y-8">
      <FormSection title="Book Details" description="Basic information about the book">
        <FormField label="Title" error={errors.title?.message} required><Input {...register('title')} placeholder="Enter book title" /></FormField>
        <FormField label="Author" error={errors.author?.message} required><Input {...register('author')} placeholder="Enter author name" /></FormField>
        <FormField label="ISBN" error={errors.isbn?.message} required><Input {...register('isbn')} placeholder="Enter ISBN" /></FormField>
        <FormField label="Category" error={errors.category?.message} required>
          <Select value={watch('category')} onValueChange={(v) => setValue('category', v)}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{['Fiction', 'Non-Fiction', 'Textbook', 'Science', 'History', 'Biography', 'Reference'].map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select>
        </FormField>
        <FormField label="Publisher" error={errors.publisher?.message}><Input {...register('publisher')} placeholder="Enter publisher" /></FormField>
        <FormField label="Publish Year" error={errors.publishYear?.message}><Input {...register('publishYear', { valueAsNumber: true })} type="number" /></FormField>
        <FormField label="Quantity" error={errors.quantity?.message} required><Input {...register('quantity', { valueAsNumber: true })} type="number" min="1" /></FormField>
        <FormField label="Location" error={errors.location?.message}><Input {...register('location')} placeholder="e.g., Shelf A-1" /></FormField>
        <FormField label="Description" error={errors.description?.message} className="sm:col-span-2"><Textarea {...register('description')} placeholder="Book description" /></FormField>
      </FormSection>
    </div>
  )
}

function IssueForm({ form, books, students, teachers }: { form: ReturnType<typeof useForm<BookIssueFormData>>; books: Book[]; students: typeof studentsData; teachers: typeof teachersData }) {
  const { register, formState: { errors }, setValue, watch } = form
  const memberType = watch('memberType')
  const members = memberType === 'student' ? students : teachers

  return (
    <div className="space-y-8">
      <FormSection title="Issue Details" description="Book issue information">
        <FormField label="Book" error={errors.bookId?.message} required className="sm:col-span-2">
          <Select value={watch('bookId')} onValueChange={(v) => setValue('bookId', v)}><SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger><SelectContent>{books.filter((b) => b.available > 0).map((b) => (<SelectItem key={b.id} value={b.id}>{b.title} ({b.available} available)</SelectItem>))}</SelectContent></Select>
        </FormField>
        <FormField label="Member Type" error={errors.memberType?.message} required>
          <Select value={watch('memberType')} onValueChange={(v) => setValue('memberType', v as 'student' | 'teacher')}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="teacher">Teacher</SelectItem></SelectContent></Select>
        </FormField>
        <FormField label="Member" error={errors.memberId?.message} required>
          <Select value={watch('memberId')} onValueChange={(v) => setValue('memberId', v)}><SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger><SelectContent>{members.map((m) => (<SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>))}</SelectContent></Select>
        </FormField>
        <FormField label="Issue Date" error={errors.issueDate?.message} required><Input {...register('issueDate')} type="date" /></FormField>
        <FormField label="Due Date" error={errors.dueDate?.message} required><Input {...register('dueDate')} type="date" /></FormField>
        <FormField label="Remarks" error={errors.remarks?.message} className="sm:col-span-2"><Textarea {...register('remarks')} placeholder="Any remarks" /></FormField>
      </FormSection>
    </div>
  )
}
