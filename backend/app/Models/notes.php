<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class notes extends Model
{
    use HasFactory;

    protected $table = 'notes';
    protected $fillable = ['etudiant_id', 'sujjet_id', 'note', 'id_filieres', 'cofficients'];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'etudiant_id');
    }

    public function sujjet()
    {
        return $this->belongsTo(Sujjet::class, 'sujjet_id');
    }

    public function filiere()
    {
        return $this->belongsTo(filieres::class, 'id_filieres');
    }
}