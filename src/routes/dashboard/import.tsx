import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, LinkIcon } from 'lucide-react'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { useForm } from '@tanstack/react-form'
import { importSchema, bulkImportSchema } from '@/schemas/import'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { scrapeUrlFn, mapUrlFn, bulkScrapeUrlsFn, type BulkScrapeProgress } from '@/data/items'
import { toast } from 'sonner'
import { type SearchResultWeb } from '@mendable/firecrawl-js'
import { Progress } from '@/components/ui/progress'

export const Route = createFileRoute('/dashboard/import')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isPending, startTransition] = useTransition()
  const [bulkIsPending, startBulkTransition] = useTransition()

  const [discoveredUrls, setDiscoveredUrls] = useState<Array<SearchResultWeb>>([])
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState<BulkScrapeProgress | null>(null)

  function handleSelectAll() {
    if (selectedUrls.size === discoveredUrls.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(discoveredUrls.map((link) => link.url)))
    }
  }

  function handleToggleUrl(url: string) {
    const newSelectedUrls = new Set(selectedUrls)

    if (newSelectedUrls.has(url)) {
      newSelectedUrls.delete(url)
    } else {
      newSelectedUrls.add(url)
    }

    setSelectedUrls(newSelectedUrls)
  }

  function handleBulkImport() {
    startBulkTransition(async () => {
      if (selectedUrls.size === 0) {
        toast.error('Please select at least one URL to import')
        return
      }

      setProgress({
        completed: 0,
        total: selectedUrls.size,
        url: '',
        status: 'success',
      })

      let successCount = 0;
      let failedCount = 0;

      for await (const update of await bulkScrapeUrlsFn({
        data: { urls: Array.from(selectedUrls) },
      })) {
        setProgress(update)

        if (update.status === 'success') {
          successCount++;
        } else {
          failedCount++;
        }
      }

      setProgress(null)

      if (failedCount > 0) {
        toast.error(`Failed to scrape ${failedCount} URLs. Please try again.`)
      } else {
        toast.success(`Successfully scraped ${successCount} URLs!`)
      }
    })
  }
  
  const form = useForm({
    defaultValues: {
      url: "",
    },
    validators: {
      onSubmit: importSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        console.log(value)
        await scrapeUrlFn({ data: value })
        toast.success('Content scraped successfully!')
      })
    },
  })

  const bulkForm = useForm({
    defaultValues: {
      url: "",
      search: "",
    },
    validators: {
      onSubmit: bulkImportSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        console.log(value)
        const urls = await mapUrlFn({ data: value })

        setDiscoveredUrls(urls)
      })
    },
  })

  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Import Content</h1>
          <p className="text-muted-foreground">Import content from a variety of sources to your ScoutTrace account.</p>
        </div>

        <Tabs defaultValue="single">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="gap-2">
              <LinkIcon className="size-4" />
              Single URL
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <Globe className="size-4" />
              Bulk Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Import from a Single URL</CardTitle>
                <CardDescription className="text-center">
                  Scrape and save content from any web page!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <form.Field
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Web Page URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://tanstack.com/start/latest"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />

                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Import URL'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Bulk Import from URLs</CardTitle>
                <CardDescription className="text-center">
                  Discover and save content from multiple URLs at once!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    bulkForm.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <bulkForm.Field
                      name="url"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="https://tanstack.com/start/latest"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />

                    <bulkForm.Field
                      name="search"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Filter (optional)
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="e.g. Blog, docs, tutorial"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />

                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Import URLs'
                      )}
                    </Button>
                  </FieldGroup>
                </form>

                {/* Discovered URLs */}
                {discoveredUrls.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold">
                        Found {discoveredUrls.length} URLs
                      </p>

                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                      >
                        {selectedUrls.size === discoveredUrls.length
                          ? 'Deselect All'
                          : 'Select All'
                        }
                      </Button>
                    </div>

                    <div className="max-h-80 space-y-2 overflow-y-auto rounded-md border p-4">
                      {discoveredUrls.map((link) => (
                        <label 
                          key={link.url}
                          className="hover:bg-muted/50 flex cursor-pointer items-start gap-3 rounded-md p-2"
                        >
                          <Checkbox 
                            checked={selectedUrls.has(link.url)}
                            onCheckedChange={() => handleToggleUrl(link.url)}
                            className="mt-0.5"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {link.title ?? 'Title not found'}
                            </p>

                            <p className="text-muted-foreground truncate text-xs">
                              {link.description ??
                                'Description not found'}
                            </p>
                            <p className="text-muted-foreground truncate text-xs">
                              {link.url}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {progress && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Scraping {progress.completed} of {progress.total} URLs
                          </span>
                          <span className="font-medium">
                            {Math.round(progress.completed / progress.total) * 100}
                          </span>
                        </div>
                        <Progress 
                          value= {(progress.completed / progress.total) * 100} 
                        />
                      </div>
                    )}

                    <Button
                      disabled={bulkIsPending}
                      onClick={handleBulkImport}
                      className="w-full"
                      type="button"
                    >
                      {bulkIsPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          {progress
                            ? `Scraping ${progress.completed} of ${progress.total} URLs`
                            : 'Starting bulk scrape...'
                          }
                        </>
                      ): (
                        `Import ${selectedUrls.size} URLs`
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
