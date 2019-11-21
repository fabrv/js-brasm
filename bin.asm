.model small 
.stack 200 
.data 
 ri db ? 
 string0 db 'Sum is: ', '$' 
.code 
 mov ax, @data 
 mov ds, ax 
 call main 
 
 sum proc 
 push bp 
 mov bp, sp
 mov ax, word ptr [bp + 4]
 mov cx, word ptr [bp + 2]
 add ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 2]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 2], ax
 mov cx, word ptr [bx - 2]
 jmp .012
 .012:
 pop bp 
 ret 4 
 sum endp
 main proc 
 push bp 
 mov bp, sp
 mov bx, 3000
 push 8
 push 3
 call f
 mov ax, cx
 mov cx, 0
 add ax, cx
 mov cx, ax
 mov ax, word ptr [bx - 4]
 mov cx, cx
 mov ax, cx 
 mov word ptr [bx - 4], ax
 lea dx, string0 
 mov ah, 9 
 int 21h
 mov ri, '0' 
 mov al, byte ptr word ptr [bx - 4] 
 add ri, al 
 mov dl, ri 
 mov ah, 2 
 int 21h
 .034:
 mov ah,4CH 
 int 21H
 pop bp 
 ret  
 main endp