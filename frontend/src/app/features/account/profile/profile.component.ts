import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    user: any = null;
    isLoading = true;
    isEditing = false;
    isSaving = false;
    successMessage = '';
    errorMessage = '';

    // Edit form fields
    editForm = {
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    constructor(
        private authService: AuthService,
        private router: Router,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.loadUserProfile();
    }

    loadUserProfile(): void {
        this.isLoading = true;
        const currentUser = this.authService.getCurrentUser();

        if (!currentUser) {
            this.router.navigate(['/login']);
            return;
        }

        // Fetch latest user data from API
        this.http.get(`/api/users/${currentUser.id}`).subscribe({
            next: (userData: any) => {
                this.user = userData;
                this.editForm.name = userData.name || '';
                this.editForm.email = userData.email || '';
                this.editForm.phone = userData.phone || '';
                this.isLoading = false;
            },
            error: () => {
                // Use cached user data if API fails
                this.user = currentUser;
                this.editForm.name = currentUser.name || '';
                this.editForm.email = currentUser.email || '';
                this.editForm.phone = currentUser.phone || '';
                this.isLoading = false;
            }
        });
    }

    toggleEditMode(): void {
        this.isEditing = !this.isEditing;
        this.successMessage = '';
        this.errorMessage = '';

        if (!this.isEditing) {
            // Reset form to current values
            this.editForm.name = this.user.name || '';
            this.editForm.email = this.user.email || '';
            this.editForm.phone = this.user.phone || '';
            this.editForm.currentPassword = '';
            this.editForm.newPassword = '';
            this.editForm.confirmPassword = '';
        }
    }

    saveProfile(): void {
        this.errorMessage = '';
        this.successMessage = '';

        // Validate
        if (!this.editForm.name.trim()) {
            this.errorMessage = 'Name is required';
            return;
        }

        if (!this.editForm.email.trim()) {
            this.errorMessage = 'Email is required';
            return;
        }

        // Validate password if changing
        if (this.editForm.newPassword) {
            if (!this.editForm.currentPassword) {
                this.errorMessage = 'Current password is required to change password';
                return;
            }
            if (this.editForm.newPassword.length < 6) {
                this.errorMessage = 'New password must be at least 6 characters';
                return;
            }
            if (this.editForm.newPassword !== this.editForm.confirmPassword) {
                this.errorMessage = 'New passwords do not match';
                return;
            }
        }

        this.isSaving = true;

        const updateData: any = {
            name: this.editForm.name.trim(),
            email: this.editForm.email.trim(),
            phone: this.editForm.phone.trim()
        };

        if (this.editForm.newPassword) {
            updateData.currentPassword = this.editForm.currentPassword;
            updateData.newPassword = this.editForm.newPassword;
        }

        this.http.put(`/api/users/${this.user.id}`, updateData).subscribe({
            next: (response: any) => {
                this.user = { ...this.user, ...updateData };
                this.successMessage = 'Profile updated successfully!';
                this.isEditing = false;
                this.isSaving = false;

                // Update stored user data
                this.authService.updateStoredUser(this.user);

                // Clear password fields
                this.editForm.currentPassword = '';
                this.editForm.newPassword = '';
                this.editForm.confirmPassword = '';
            },
            error: (err) => {
                this.errorMessage = err?.error?.message || 'Failed to update profile';
                this.isSaving = false;
            }
        });
    }

    getRoleDisplay(): string {
        if (!this.user) return '';
        const role = this.user.role?.toLowerCase();
        if (role === 'organizer') return 'Event Organizer';
        if (role === 'attendee') return 'Event Attendee';
        if (role === 'admin') return 'Administrator';
        return role || 'User';
    }

    getRoleIcon(): string {
        if (!this.user) return '👤';
        const role = this.user.role?.toLowerCase();
        if (role === 'organizer') return '🎪';
        if (role === 'attendee') return '🎟️';
        if (role === 'admin') return '👑';
        return '👤';
    }

    getInitials(): string {
        if (!this.user?.name) return '?';
        return this.user.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    getMemberSince(): string {
        if (!this.user?.created_at) return 'N/A';
        return new Date(this.user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }
}
