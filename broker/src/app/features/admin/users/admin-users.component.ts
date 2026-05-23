import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="font-display text-2xl font-bold">User Management</h2>
      <div class="glass-card overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-4 py-3 text-left">Name</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            @for (u of users; track u.email) {
              <tr class="border-t border-slate-100 dark:border-slate-800">
                <td class="px-4 py-3">{{ u.name }}</td>
                <td class="px-4 py-3">{{ u.email }}</td>
                <td class="px-4 py-3 capitalize">{{ u.role }}</td>
                <td class="px-4 py-3"><span class="text-emerald-600">{{ u.status }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminUsersComponent {
  readonly users = [
    { name: 'Jane Wanjiku', email: 'borrower@broker.ke', role: 'borrower', status: 'Active' },
    { name: 'Peter Ochieng', email: 'lender@broker.ke', role: 'lender_admin', status: 'Active' },
    { name: 'Grace Akinyi', email: 'admin@broker.ke', role: 'super_admin', status: 'Active' },
  ];
}
