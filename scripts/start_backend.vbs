Call Crun()

' "mosque"ディレクトリパスを取得
Set objFso = CreateObject("Scripting.FileSystemObject")
baseDir = objFso.getParentFolderName(WScript.ScriptFullName)
baseDir = objFso.getParentFolderName(baseDir)
WScript.Echo baseDir

' プロセスIDを記録したファイルがあるか
Set objShell = WScript.CreateObject("WScript.Shell")
pidPath = objFso.BuildPath(baseDir, "backend.pid")
If objFso.FileExists(pidPath) Then
	Set objFile = objFso.OpenTextFile(pidPath, 1, True)
	pid = objFile.ReadLine
	objFile.Close
	WScript.Echo pid

	' PIDが古いかも
	Set objExec = objShell.Exec("tasklist /fi ""PID eq " & pid & """")
	stdout = objExec.StdOut.ReadAll()
	If InStr(stdout, "python.exe") > 0 Then
    WScript.Echo "backend is already running"
    WScript.Quit
	End If

	' プロセスIDファイルを削除
	objFso.DeleteFile pidPath
End If

' start_main.batのフルパスを作成
scriptPath = objFso.BuildPath(baseDir, "scripts")
scriptPath = objFso.BuildPath(scriptPath, "start_main.bat")
WScript.Echo scriptPath

' start_main.batをバックグラウンドで実行
Set objExec = objShell.Exec("cmd.exe /c " & Dd(scriptPath))


' **********************************************************
' Cscript.exe で実行を強制
' **********************************************************
Function Crun( )

	Dim str,WshShell

	' 実行中の WSH のフルパス
	str = WScript.FullName
	' 右から11文字取得
	str = Right( str, 11 )
	' 全て大文字に変更
	str = Ucase( str )
	' CSCRIPT.EXE でなければ処理を行う
	if str <> "CSCRIPT.EXE" then
		' 実行中の自分自身(スクリプト)のフルパスを取得
		str = WScript.ScriptFullName

		Set WshShell = CreateObject( "WScript.Shell" )

		' 実行中の自分自身(スクリプト)への引数を引き継ぐ為の文字列を作成
		strParam = " "
		For I = 0 to Wscript.Arguments.Count - 1
			if instr(Wscript.Arguments(I), " ") < 1 then
				strParam = strParam & Wscript.Arguments(I) & " "
			else
				strParam = strParam & Dd(Wscript.Arguments(I)) & " "
			end if
		Next
		' cscript.exe で実行しなおす為のコマンドラインを実行
		Call WshShell.Run( "cmd.exe /c cscript.exe " & Dd(str) & strParam, 1 )
		' 実行中の自分自身(スクリプト)を終了
		WScript.Quit
	end if

End Function
' **********************************************************
' 文字列を " で囲む関数
' **********************************************************
Function Dd( strValue )

	Dd = """" & strValue & """"

End function
