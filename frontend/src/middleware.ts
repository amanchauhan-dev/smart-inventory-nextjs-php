import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

type LoginTokenPayloadType = {
    id: string;
    email: string;
    role: "staff" | "admin" | "superadmin";
    org_id: string;
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// All protected routes: both staff and admin can access
const protectedRoutes = [
    "/dashboard",
    "/users",
    "/products",
    "/product-categories",
    "/incomes",
    "/income-category",
    "/expense-category",
    "/analytics",
    "/profile",
];

// Only admin or superadmin should access
const adminOnlyRoutes = ["/analytics", "/incomes", "/users"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only run middleware for protected routes
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (!isProtected) { return NextResponse.next() };

    try {
        const token = request.cookies.get("token")?.value || "";
        const payload = (await jwtVerify(token, secret)).payload as LoginTokenPayloadType;

        // console.log('payload', payload);
        // If trying to access an admin-only route with staff role
        if (adminOnlyRoutes.some((route) => pathname.startsWith(route)) && payload.role === "staff") {
            return NextResponse.redirect(new URL("/dashboard", request.url)); // or send 403
        }

        // Authenticated and authorized
        return NextResponse.next();

    } catch (error: any) {
        // Not authenticated
        return NextResponse.redirect(new URL("/login?error=" + error.message, request.url));
    }
}
