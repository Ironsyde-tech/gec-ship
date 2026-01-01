import { Skeleton } from "@/components/ui/skeleton";

// Card skeleton for shipments, quotes, etc.
export const CardSkeleton = () => (
  <div className="bg-card rounded-xl border border-border p-6">
    <div className="flex items-start gap-4">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  </div>
);

// List of card skeletons
export const CardListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Table row skeleton
export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Table skeleton
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 5 
}: { 
  rows?: number; 
  columns?: number;
}) => (
  <div className="border rounded-lg overflow-hidden">
    <table className="w-full">
      <thead className="bg-muted">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="p-4 text-left">
              <Skeleton className="h-4 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// Stats card skeleton
export const StatsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Profile form skeleton
export const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
    <Skeleton className="h-10 w-32" />
  </div>
);

// Address card skeleton
export const AddressSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-1">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-32" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

// Address list skeleton
export const AddressListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <AddressSkeleton key={i} />
    ))}
  </div>
);

// Chart skeleton
export const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div className="bg-card rounded-xl border border-border p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-24" />
    </div>
    <Skeleton className={`w-full rounded`} style={{ height }} />
  </div>
);

// Page header skeleton
export const PageHeaderSkeleton = () => (
  <div className="space-y-2 mb-8">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-96" />
  </div>
);

// Full page loading skeleton
export const PageSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <PageHeaderSkeleton />
    <StatsSkeleton />
    <div className="mt-8">
      <CardListSkeleton count={4} />
    </div>
  </div>
);

export default {
  CardSkeleton,
  CardListSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  StatsSkeleton,
  ProfileSkeleton,
  AddressSkeleton,
  AddressListSkeleton,
  ChartSkeleton,
  PageHeaderSkeleton,
  PageSkeleton,
};
